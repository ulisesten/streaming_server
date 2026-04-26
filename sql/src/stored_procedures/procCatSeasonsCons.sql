SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:    Ulises Martínez Elías
-- Create date: 24/04/2026
-- Description:  Para consulta temporadas
-- =============================================
ALTER PROCEDURE [dbo].[procCatSeasonsCons]
    @tipoConsulta    SMALLINT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CONS_SEASONS_CONS SMALLINT = 1;

    --- Consulta para obtener todas las temporadas
    IF @tipoConsulta = @CONS_SEASONS_CONS BEGIN
        
        SELECT
            sea_id,
            sea_numero,
            sea_id_serie,
            sea_id_thumbnail
        FROM
            cat_seasons
            
    END

END
GO
