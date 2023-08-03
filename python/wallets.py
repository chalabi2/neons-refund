import pandas as pd

# Load the data
df = pd.read_csv('token_disbursement.txt', sep='\t', header=None, names=['wallet', 'amount'])

# Begin the string
wallets_str = "const recipients = ["

# For each wallet, append it to the string in the correct format
for wallet in df['wallet']:
    wallets_str += f'"{wallet}", '

# Remove the last comma and space, and add the closing bracket
wallets_str = wallets_str[:-2] + "];"

# Print the string
print(wallets_str)
