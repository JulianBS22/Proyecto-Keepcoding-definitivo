CREATE TABLE "movimientos" (
    "id"    INTEGER,
    "date"  TEXT NOT NULL,
    "time"  TEXT NOT NULL,
    "moneda_from"   TEXT NOT NULL,
    "cantidad_from" REAL,
    "moneda_to" TEXT NOT NULL,
    "cantidad_to"   REAL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "wallet" (
    "moneda"   TEXT NOT NULL,
    "cantidad" REAL,
    PRIMARY KEY("moneda")
);
