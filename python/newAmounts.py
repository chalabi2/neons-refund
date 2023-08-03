import pandas as pd

# Load the data
df = pd.read_csv('percentages_shared.txt', sep='\t', header=None, names=['wallet', 'percentage'])

# The total amount of tokens available for disbursement
total_amount = 731670  # You can change this value

# Calculate the token amount for each wallet and round it to 2 decimal places
df['token_amount'] = (df['percentage'] * total_amount).round(2)

# Convert token amounts to smallest unit
df['token_amount'] = df['token_amount'].apply(lambda x: '{:.18f}'.format(x)).replace('.', '')

# Write the updated data to a new file
df.to_csv('token_disbursement.txt', sep='\t', header=False, index=False, columns=['wallet', 'token_amount'])

# Print the sum of the calculated token amounts
print('Calculated total:', df['token_amount'].sum())
