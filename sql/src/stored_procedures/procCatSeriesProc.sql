SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ===================================================
-- Autor:        Ulises
-- Fecha:        2026-04-23
-- Descripción:      Procesos captura de series
-- ===================================================
ALTER PROCEDURE [dbo].[procCatSeriesProc]
    @tipoRegistro    SMALLINT,
    @ser_nombre       VARCHAR(100),
    @ser_id_thumbnail INT,

    @fecha_alta     datetime,
    @usuario_alta   int,
    @fecha_mod      datetime,
    @usuario_mod    int,
    @error          int,
    @msg            varchar(150), 
    @error_state    int,
    @error_sev      int,
    @success        varchar(5)
AS
BEGIN TRANSACTION

    DECLARE @PROC_SERIES_NEW SMALLINT = 1;

    IF @tipoRegistro = @PROC_SERIES_NEW BEGIN
        BEGIN TRY
                DECLARE @thumbnail char(11);

                --- Obtener el ID público del thumbnail
                SELECT
                    @thumbnail = thu_id_public
                FROM
                    cat_videos_thumbnails
                WHERE
                    thu_id = @ser_id_thumbnail;


                INSERT into cat_series (
                    ser_nombre,
                    ser_id_thumbnail,
                    ser_thumbnail,
                    usuario_alta,
                    fecha_alta
                ) values(
                    @ser_nombre,
                    @ser_id_thumbnail,
                    @thumbnail,
                    @usuario_alta,
                    @fecha_alta
                )


                SELECT @msg='Serie creada exitosamente.', @error = 0, @success = 'true'
        END TRY
        BEGIN CATCH  
            SELECT   @msg = ERROR_MESSAGE(), @error = @@ERROR, @error_sev = ERROR_SEVERITY(),@error_state = ERROR_STATE()
            RAISERROR(@msg,@error_sev,@error_state);
            ROLLBACK TRANSACTION
            RETURN
        END CATCH

        SELECT 
            success = @success, 
            msg= @msg, 
            error=  @error
    END

    

COMMIT TRANSACTION
GO
