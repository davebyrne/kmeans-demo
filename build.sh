git checkout gh-pages
PUBLIC_URL=https://davebyrne.github.io/kmeans-demo yarn build
rm -rf docs/ && mv build docs && touch docs/.nojekyll
git add .
git commit -m 'web commit'
