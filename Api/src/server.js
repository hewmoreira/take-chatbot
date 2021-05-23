const axios = require('axios')
const express = require ('express')
const app = express()
const url = 'https://api.github.com/orgs/takenet/repos?sort=created&direction=asc'
const maxRepos = 5

const language = f => f.language === 'C#'

app.get('/', async (req, res) => {

    try {
        const { data } = await axios(url)
        const getMappedValues = ({ id, name, owner:{avatar_url}, description, created_at, language }) => ({ id, name, owner:{avatar_url}, created_at, description, language });
        const repos = data
            .filter(language)
            .slice(0, maxRepos)
            .map(getMappedValues)

        function reducer(acc, cur){
            return {...acc, [cur.id]: cur}
        }

        const repository = repos.reduce(reducer, {})   

        return res.json(repository)
    } catch (error) {
        console.error(error)
    }
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });