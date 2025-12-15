CREATE TABLE [dbo].[cat_usuarios](
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