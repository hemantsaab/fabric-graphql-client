/****** Object:  StoredProcedure [dbo].[sp_UpdateQuantity]    Script Date: 2/5/2026 9:36:22 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateQuantity]
(
    @id UNIQUEIDENTIFIER,
    @quantity INT
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Items
    SET quantity = @quantity
    WHERE id = @id;

    -- Return a single-row result with status + the updated row (if it exists)
    IF @@ROWCOUNT = 0
    BEGIN
        SELECT
            @id AS id,
            CAST(0 AS bit) AS updated,
            CAST(NULL AS varchar(32)) AS name,
            CAST(NULL AS varchar(20)) AS type,
            CAST(NULL AS int) AS quantity;
        RETURN;
    END

    SELECT
        id,
        CAST(1 AS bit) AS updated,
        name,
        type,
        quantity
    FROM dbo.Items
    WHERE id = @id;
END
GO


