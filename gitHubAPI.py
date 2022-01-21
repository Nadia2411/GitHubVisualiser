from github import Github
from pprint import pprint
import requests
import json
import base64

g = Github("token")
usr = g.get_user()
dct = {
        'user': usr.login,
        'name': usr.name,
        'location':usr.location,
        'company':  usr.company
}
print("dict is " + json.dumps(dct))

username = "Nadia2411"
g = Github()
user = g.get_user(username)
for repo in user.get_repos():
    print(repo)

g = Github("access-token")
for repo in g.get_user().get_repos():
    print(repo.name)
    branch = repo.get_branch("main")
    print("{0:60} Most Recent {1:120}".format(str(repo), str(branch.commit)))

url = f"https://api.github.com/users/{username}"
user_data = requests.get(url).json()
pprint(user_data)