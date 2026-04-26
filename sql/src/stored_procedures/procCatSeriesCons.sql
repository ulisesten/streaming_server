SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:    Ulises Martínez Elías
-- Create date: 23/04/2026
-- Description:  Para consulta series
-- =============================================
ALTER PROCEDURE [dbo].[procCatSeriesCons]
    @tipoConsulta    SMALLINT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CONS_SERIES_CONS SMALLINT = 1;

    --- Consulta para obtener todas las series
    IF @tipoConsulta = @CONS_SERIES_CONS BEGIN
        
        SELECT
            ser_id,
            ser_nombre,
            ser_id_thumbnail
        FROM
            cat_series
            
    END

END
GO
