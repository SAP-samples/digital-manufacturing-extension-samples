# DMC Extensibility Bootcamp - Agenda and Participant Guide
The material of DMC Extensibility Bootcamp will be built and hosted on the GitHub Pages. 
To help with building GitHub Pages, we've used MkDocs tool, which is fast, simple and downright gorgeous static site generator that's geared towards building project documentation.

# How to build and deploy the GitHub Pages
1. Install Mkdocs on your local machine. Please refer to [https://www.mkdocs.org/user-guide/installation/](https://www.mkdocs.org/user-guide/installation/)
```
pip install mkdocs
```
2. Clone the master branch repository.
3. To build and run the Docs locally.
```
mkdocs serve
```
4. To build and deploy the Docs to Github. Behind the scenes, MkDocs will build your docs and use the ghp-import tool to commit them to the gh-pages branch and push the gh-pages branch to GitHub.
```
mkdocs gh-deploy
```