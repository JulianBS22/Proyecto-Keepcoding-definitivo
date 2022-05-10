
from select import select
import sqlite3

class ProcesaDatos:
    def __init__(self, file=":memory:"):
        self.origen_datos = file

    def crea_diccionario(self, cur):
        filas = cur.fetchall()

        campos = []
        for item in cur.description:
            campos.append(item[0])

        resultado = []

        for fila in filas:
            registro = {}

            for clave, valor in zip(campos, fila):
                registro[clave] = valor

            resultado.append(registro)
        return resultado 

    def results(self, cur, con):
 
        if cur.description:
            resultado = self.crea_diccionario(cur)
        else:
            resultado = None
            con.commit()
        return resultado

    def haz_consulta(self, consulta, params=[]):
        con = sqlite3.connect(self.origen_datos)
        cur = con.cursor()

        cur.execute(consulta, params)

        resultado = self.results(cur, con)

        con.close()

        return resultado



    def haz_delete(self, consulta, params):
            con = sqlite3.connect(self.origen_datos)
            cur = con.cursor()

            cur.execute(consulta, (params,))
            con.commit()
            con.close()
         


    def recupera_datos(self):
        return self.haz_consulta("""
                        SELECT date, time, moneda_from, cantidad_from, moneda_to, cantidad_to
                        FROM movimientos
                        ORDER BY date
                    """
        )


    def consulta_id(self, id):
        return self.haz_consulta("""
                        SELECT date, time, moneda_from, cantidad_from, moneda_to, cantidad_ to
                        FROM movimientos
                         WHERE id = ?      
                    """, (id,))



    
    def modifica_datos(self, params):
        self.haz_consulta("""
                    INSERT INTO movimientos (date, time, moneda_from, cantidad_from, moneda_to, cantidad_to )
                                    values (?, ?, ?, ?, ?, ?)
                    """, params)


    def update_datos(self, params):
        self.haz_consulta("""
                        UPDATE movimientos set date = ?, time = ?, moneda_from = ?, cantidad_from = ?, moneda_to= ?, cantidad_to
                        WHERE id = ?
                        """, params)

    def recupera_monedas_wallet(self):
        return self.haz_consulta("""
                        SELECT moneda, cantidad
                        FROM wallet
                    """
        )
  
    def recupera_cantidadInvertida(self):
        return self.haz_consulta("""
                        SELECT sum(cantidad_from) as inversion
                        FROM movimientos
                        WHERE moneda_from = 'EUR'
                    """
        )
    def recupera_cantidadRescatada(self):
        return self.haz_consulta("""
                        SELECT sum(cantidad_to) as rescatado
                        FROM movimientos
                        WHERE moneda_to = 'EUR'
                    """
        )

    def borraMoneda(self,params):
        print(params)
        self.haz_delete("""
                DELETE 
                FROM wallet
                where moneda = ?
            """,params
        )

    def actualizaMoneda (self, params):
        self.haz_consulta("""
                        UPDATE wallet set cantidad = ?
                        WHERE moneda = ?
                    """, params)

    def insertarMoneda(self,params):
        self.haz_consulta("""
                    INSERT INTO wallet ( cantidad, moneda)
                                    values (?, ?)
                    """, params)
                                      