SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Items](
	[id] [uniqueidentifier] NOT NULL,
	[name] [varchar](32) NOT NULL,
	[type] [varchar](20) NOT NULL,
	[quantity] [int] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Index [ClusteredIndex]    Script Date: 2/5/2026 9:32:07 AM ******/
CREATE CLUSTERED COLUMNSTORE INDEX [ClusteredIndex] ON [dbo].[Items] WITH (DROP_EXISTING = OFF, COMPRESSION_DELAY = 0, DATA_COMPRESSION = COLUMNSTORE) ON [PRIMARY]
GO


