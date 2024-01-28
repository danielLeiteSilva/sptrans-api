const request = require("request")

const url = "http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=YOUR_TOKEN"

function auth() {
  return new Promise((resolve, reject) => {
    request.post(url, (error, response, data) =>{
      if(error) return reject(error)
      if(response.statusCode !== 200) return reject(response.statusCode)
      resolve(response.headers["set-cookie"])
    })
  })
}


const urlPosition = "http://api.olhovivo.sptrans.com.br/v2.1/Posicao/Linha?codigoLinha"
async function getPosition(linha, cookie){
  const options = {
    headers: {
      Cookie: cookie
    }
  }
  return new Promise((resolve, reject) => {
    request.get(`${urlPosition}=${linha}`, options, (error, response, data) => {
      resolve(data)
    })
  })

}

async function start(){
  const cookie = await auth()
  const position = await getPosition("6078", cookie)

  console.log(position)
}

start()