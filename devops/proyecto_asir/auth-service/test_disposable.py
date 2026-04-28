from disposable_email_domains import blocklist
print(f"Total domains in blocklist: {len(blocklist)}")
test_domain = "yopmail.com"
print(f"Is '{test_domain}' in blocklist? {test_domain in blocklist}")
