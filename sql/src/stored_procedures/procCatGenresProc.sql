SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ===================================================
-- Autor:        Ulises
-- Fecha:        2026-04-24
-- Descripción:      Procesos captura de géneros
-- ===================================================
ALTER PROCEDURE [dbo].[procCatGenresProc]
    @tipoRegistro    SMALLINT,
    @gen_nombre       VARCHAR(100),

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

    DECLARE @PROC_GENRES_NEW SMALLINT = 1;

    IF @tipoRegistro = @PROC_GENRES_NEW BEGIN
        BEGIN TRY
                INSERT into cat_genres (
                    gen_nombre,
                    usuario_alta,
                    fecha_alta
                ) values(
                    @gen_nombre,
                    @usuario_alta,
                    @fecha_alta
                )

                SELECT @msg='Género creado exitosamente.', @error = 0, @success = 'true'
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
