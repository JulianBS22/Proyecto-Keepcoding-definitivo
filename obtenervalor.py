from config import SECRET_KEY

endpoint = "https://rest.coinapi.io/v1/exchangerate/{}/{}"
headers = {'X-CoinAPI-Key' :SECRET_KEY }            
endpointCambioaEuros = "https://rest.coinapi.io/v1/exchangerate/EUR"