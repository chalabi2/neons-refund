import pandas as pd

# Load the data
df = pd.read_csv('highest_bids.csv')

# Group by 'from' and sum 'amount'
total_bids = df.groupby('from')['amount'].sum().reset_index()

# Filter out rows where 'amount' is zero or less than 100
total_bids = total_bids.loc[total_bids['amount'] >= 100]

# Calculate total sum of all amounts
total_sum = total_bids['amount'].sum()

# Calculate the proportion of the total sum each wallet has contributed
total_bids['percentage'] = total_bids['amount'] / total_sum

# Sort 'total_bids' by 'amount' in descending order
total_bids = total_bids.sort_values('amount', ascending=False)

# Open the text file in write mode
with open('total_bids.txt', 'w') as file:
    for index, row in total_bids.iterrows():
        # Write the wallet and amount to the file
        file.write(f'{row["from"]}\t{row["amount"]}\n')

# Open the text file 'percentages_shared.txt' in write mode
with open('percentages_shared.txt', 'w') as file:
    for index, row in total_bids.iterrows():
        # Write the wallet and proportion to the file
        file.write(f'{row["from"]}\t{row["percentage"]}\n')

# Print the total sum of all amounts
print(f'The total sum of all amounts is: {total_sum}')
