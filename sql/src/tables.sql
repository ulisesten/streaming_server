CREATE TABLE cat_usuarios(
	[usu_id] [int] IDENTITY(1,1) NOT NULL,
	[usu_nombre] [nvarchar](100) NOT NULL,
	[usu_ape_paterno] [nvarchar](100) NOT NULL,
	[usu_ape_materno] [nvarchar](100) NOT NULL,
	[usu_correo] [nvarchar](150) NOT NULL,
	[usu_contrasena] [nvarchar](64) NULL,
	[fecha_alta] [datetime] NOT NULL,
	[usuario_alta] [int] NOT NULL,
	[fecha_mod] [datetime] NULL,
	[usuario_mod] [int] NULL
)

CREATE TABLE cat_genres(
    [gen_id] [smallint] IDENTITY(1,1) NOT NULL,
    [gen_nombre] [varchar](50) NOT NULL,
    [usuario_alta] int NOT NULL,
    [fecha_alta] [datetime] NOT NULL
)

DROP TABLE IF EXISTS cat_seasons;

CREATE TABLE cat_seasons(
    [sea_id] [INT] IDENTITY(1,1) NOT NULL,
    [sea_id_serie] INT NOT NULL,
    [sea_numero] [smallint] NOT NULL,
    [sea_id_thumbnail] INT NOT NULL,
    [usuario_alta] int NOT NULL,
    [fecha_alta] [datetime] NOT NULL,
    [usuario_mod] int,
    [fecha_mod] [datetime]
)