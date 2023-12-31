import pandas as pd

# Load the data
df = pd.read_csv('percentages_shared.txt', sep='\t', header=None, names=['wallet', 'percentage'])

# Blacklisted wallet details
blacklisted_wallets = ['0x4458078A41B02E4C4293Dfa1d69faf1978B86e24']

# Remove rows with blacklisted wallet addresses
df = df[~df['wallet'].isin(blacklisted_wallets)]

# The total amount of tokens available for disbursement
total_amount = 697070  # You can change this value

# Compute the token amounts for all remaining wallets and round them off
df['token_amount'] = (df['percentage'] / df['percentage'].sum()) * total_amount
df['token_amount'] = df['token_amount'].round(0).astype(int)

# Adjust rounding errors to make sure sum matches the total
difference = total_amount - df['token_amount'].sum()
indices = df.nlargest(abs(difference), 'token_amount').index
df.loc[indices, 'token_amount'] += 1 if difference > 0 else -1

# Write the updated data to a new file
df.to_csv('token_disbursement.txt', sep='\t', header=False, index=False, columns=['wallet', 'token_amount'])

# Check the sum of the calculated token amounts
if df['token_amount'].sum() == total_amount:
    print(f'Success! The calculated total matches the given total: {total_amount}')
else:
    print(f'Error: The calculated total is different from the given total.')
