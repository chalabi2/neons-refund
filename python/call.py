from concurrent.futures import ThreadPoolExecutor
from web3 import Web3, HTTPProvider
import csv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a session with your custom headers
headers = {'X-API-KEY': '1fe833163bc704b245c92e00', 'Content-Type': 'application/json'}

try:
    w3 = Web3(HTTPProvider('https://canto.ansybl.io/mainnet/evm_rpc/', request_kwargs={'headers': headers}))
except Exception as e:
    logger.error(f"Error connecting to the node: {e}")


# Your target contract address
contract_address = '0x157B312d199031afC82D77a34269D3Da51436afd'

# Function signature for createBid(uint256)
function_signature = 'createBid(uint256)'

# Get the function selector (first 4 bytes of the Keccak-256 hash of the function signature)
function_selector = w3.keccak(text='createBid(uint256)')[:4]

# Get the latest block number
try:
    latest_block = w3.eth.block_number
except Exception as e:
    logger.error(f"Error fetching latest block number: {e}")

# Define a range of blocks to inspect
start_block = 4960922
end_block = latest_block

# Total number of blocks to be parsed
total_blocks = end_block - start_block
logger.info(f"Parsing {total_blocks} blocks for transactions containing createBid")

# A function to process a single block
def process_block(block_number):
    transactions = []
    try:
        # Get the block details
        block = w3.eth.get_block(block_number, full_transactions=True)
        # Loop through each transaction in the block
        for transaction in block.transactions:
            # Check if the transaction is a call to 'createBid'
            if transaction['to'] == contract_address and transaction['input'].startswith(function_selector):
                transactions.append(transaction)
        logger.info(f"Processing Block {block_number}") 
    except Exception as e:
        logger.error(f"Error processing block {block_number}: {e}")
    return transactions

# Open the file in write mode
with open('bidSenders4.csv', 'w', newline='') as file:
    # Create a csv writer object
    writer = csv.writer(file)
    # Write the headers
    writer.writerow(['from', 'tokenid', 'amount'])

    bid_transactions = 0
    # Use a thread pool executor to process the blocks concurrently
    executor = ThreadPoolExecutor()
    try:
        # Process all blocks in the range
        for transactions in executor.map(process_block, range(start_block, end_block + 1)):
            # Write all transactions to the file
            for transaction in transactions:
                bid_transactions += 1
                logger.info(f"Bid Transactions Found: {bid_transactions}")
                try:
                    # Get the nounId from the input data
                    nounId = int(transaction['input'].hex()[len(function_selector.hex()):], 16)
                    eth_value = Web3.from_wei(transaction["value"], "ether")
                    # Write the data to the file
                    writer.writerow([transaction["from"], nounId, eth_value])
                except Exception as e:
                    logger.error(f"Error writing transaction to file: {e}")
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt. Shutting down...")
        executor.shutdown(wait=False)
        logger.info("Executor shutdown complete.")
