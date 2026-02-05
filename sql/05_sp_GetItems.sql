/****** Object:  StoredProcedure [dbo].[sp_GetItems]    Script Date: 2/5/2026 9:37:46 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER   PROCEDURE [dbo].[sp_GetItems]
(
    @skip INT = 0,
    @take INT = 100
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Guardrails
    IF @skip < 0 SET @skip = 0;
    IF @take IS NULL OR @take <= 0 SET @take = 100;
    IF @take > 500 SET @take = 500;  -- cap to protect API

    SELECT
        id,
        name,
        type,
        quantity
    FROM dbo.Items
    ORDER BY name, id
    OFFSET @skip ROWS
    FETCH NEXT @take ROWS ONLY;
END
GO


