Api para invertir en criptomonedas, por favor siga las instrucciones para su instalación.

instalar dependencias:
pip install -r requirements.txt


#crear Base de datos#

Acceder al directorio /datos con el comando cd /datos
Teniendo instalado en tu equipo Sqlite ejecutar el siguiente comando para crear la base de datos:

sqlite3 movimientos.db

en el directorio /datos existe un script SQL llamado crea_tablas.sql que habrá que ejecutar en la base de datos recien creada para iniciar el esquema necesario
para correr la aplicación.

#Variables de entorno#

Renombrar el fichero config_template.py a config.py
El fichero config.py deberá tener al menos dos entradas para correr la aplicación correctamente:
RUTA_BBDD y SECRET_KEY
La variable RUTA_BBDD es una referencia a la base de datos creada en el punto anterior.
La variable SECRET_KEY deberá contener el API KEY personal obtenido en la pagina CoinApi.io


Fichero .env
Copiar el fichero .env_template, renombrarlo a .env y elegir una de las opciones de FLASK_ENV
copiar movimientos.db en la dirección: data/movimientos.db

START
para proceder con el programa, se debe activar el entorno virtual  (venv\scripts\activate) y posteriormente ejecutar flask run

