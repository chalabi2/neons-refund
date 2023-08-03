import pandas as pd

def analyze_bids(filename):
    # Load the data
    df = pd.read_csv(filename)
    
    # Filter rows where amount is greater than 0
    df = df[df['amount'] > 0]

    # Filter rows where tokenid is 4316 or lower and not a 10th token
    df = df[(df['tokenid'] <= 4764) & (df['tokenid'] % 10 != 0)]
    
    # Compute the statistics
    avg_price = df['amount'].mean()
    max_price = df['amount'].max()
    min_price = df['amount'].min()
    total_amt = df['amount'].sum()

    # Find the highest priced NFT details
    highest_priced_nft = df[df['amount'] == max_price]
    highest_priced_wallet = highest_priced_nft['from'].values[0]
    highest_priced_id = highest_priced_nft['tokenid'].values[0]
    
    # Find the wallet with most won bids and the number of bids won
    top_bidder = df['from'].value_counts().idxmax()
    top_bidder_bids = df['from'].value_counts().max()
    
    # Check for burnt tokenids (i.e., missing from the dataframe)
    all_tokenids = set(range(1, 4765))  # all possible tokenids from 1 to 4316
    present_tokenids = set(df['tokenid'].unique())
    burnt_tokenids = all_tokenids - present_tokenids

    # Print the statistics
    print('Total Canto Locked:', total_amt)
    print('Average price:', avg_price)
    print('Highest price:', max_price)
    print('Lowest price:', min_price)
    print('Wallet with most won bids:', top_bidder, 'Bids:', top_bidder_bids)
    print('Number of burnt NFTs:', len(burnt_tokenids))
    print('Number of minted NFTs:', len(present_tokenids))
    print('Holder and ID of highest priced NFT:', highest_priced_wallet, highest_priced_id)

# Call the function with your filename
analyze_bids('highest_bids.csv')
