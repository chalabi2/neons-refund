import pandas as pd
from decimal import Decimal

# Load the data
df = pd.read_csv('token_disbursement.txt', sep='\t', header=None, names=['wallet', 'amount'])

# Begin the string
amounts_str = "const amounts = ["

# For each amount, append it to the string in the correct format
for amount in df['amount']:
    amounts_str += f'ethers.utils.parseUnits("{amount}", 18), '

# Remove the last comma and space, and add the closing bracket
amounts_str = amounts_str[:-2] + "];"

# Print the string
print(amounts_str)
