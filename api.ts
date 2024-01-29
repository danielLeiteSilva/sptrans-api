import request from "request"
import dontenv from "dotenv"

dontenv.config()

const url: string = `http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=${process.env.TOKEN}`

function auth(): Promise<string> {
  return new Promise((resolve, reject) => {
    request.post(url, (error: any, response: any, data: any) => {
      if (error) return reject(error)
      if (response.statusCode !== 200) return reject(response.statusCode)
      return resolve(response.headers["set-cookie"])
    })
  })
}

type Search = {
  cl: number,
  lc: boolean,
  lt: string,
  sl: number,
  tl: number,
  tp: string, 
  ts: string
}

const urlLine: string = "https://api.olhovivo.sptrans.com.br/v2.1/Linha/Buscar?termosBusca"
function searchLine(cookie: string, linha: string): Promise<Array<Search>>  {
  const options = {
    headers: {
      Cookie: cookie
    }
  }
  return new Promise((resolve, reject) => {
    request.get(`${urlLine}=${linha}`, options, (error: any, response: any, data: any) => {
      return resolve(JSON.parse(data))
    })
  })
}

type Line = {
  p: string,
  a: boolean,
  ta: string,
  py: number,
  px: number,
  sv: any,
  is: any
}

type Position = {
  hr: string,
  vs: Array<Line>
}

const urlPosition: string = "http://api.olhovivo.sptrans.com.br/v2.1/Posicao/Linha?codigoLinha"
async function getPosition(linha: number, cookie: string): Promise<Position> {
  const options = {
    headers: {
      Cookie: cookie
    }
  }
  return new Promise((resolve, reject) => {
    request.get(`${urlPosition}=${linha}`, options, (error: any, response: any, data: any) => {
      return resolve(JSON.parse(data))
    })
  })

}

async function start(): Promise<void> {
  const cookie: string = await auth()
  const search: Array<Search>= await searchLine(cookie, "6078-10")
  const id: number = search[0].cl
  const position: Position = await getPosition(id, cookie)

  console.log(position)
}

start()