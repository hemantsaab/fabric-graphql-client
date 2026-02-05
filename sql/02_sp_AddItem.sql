/****** Object:  StoredProcedure [dbo].[sp_AddItem]    Script Date: 2/5/2026 9:34:40 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER PROCEDURE [dbo].[sp_AddItem]
(
    -- Add the parameters for the stored procedure here
    @name varchar(32),
    @type varchar(20),
    @quantity int
)
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

    DECLARE @id UNIQUEIDENTIFIER = NEWID()

    -- Insert statements for procedure here
    INSERT INTO [dbo].[Items] (id, name, type, quantity)
    VALUES (@id, @name, @type, @quantity)

    SELECT id, name, type, quantity
    FROM [dbo].[Items]
    WHERE id = @id

END
GO


