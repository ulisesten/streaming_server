SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:    Ulises Martínez Elías
-- Create date: 24/04/2026
-- Description:  Para consulta géneros
-- =============================================
ALTER PROCEDURE [dbo].[procCatGenresCons]
    @tipoConsulta    SMALLINT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CONS_GENRES_CONS SMALLINT = 1;

    --- Consulta para obtener todos los géneros
    IF @tipoConsulta = @CONS_GENRES_CONS BEGIN
        
        SELECT
            gen_id,
            gen_nombre
        FROM
            cat_genres
            
    END

END
GO
