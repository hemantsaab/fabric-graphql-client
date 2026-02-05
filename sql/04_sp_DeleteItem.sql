/****** Object:  StoredProcedure [dbo].[sp_DeleteItem]    Script Date: 2/5/2026 9:37:07 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteItem]
(
    -- Add the parameters for the stored procedure here
    @id UNIQUEIDENTIFIER
)
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

    -- Insert statements for procedure here
    DELETE [dbo].[Items] 
    WHERE id = @id

    SELECT 
        @id AS id,
        CASE WHEN @@ROWCOUNT > 0 THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS deleted;

END
GO


