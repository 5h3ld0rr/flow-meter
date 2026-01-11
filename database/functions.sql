CREATE OR ALTER FUNCTION TimeAgo(@date DATETIME2)
RETURNS NVARCHAR(50)
AS
BEGIN
    DECLARE @diff INT;
    DECLARE @unit NVARCHAR(20);
    DECLARE @value INT;

    SET @diff = DATEDIFF(SECOND, @date, GETUTCDATE());

    IF @diff < 60
        RETURN 'just now';

    IF @diff < 3600 -- less than 1 hour
    BEGIN
        SET @value = @diff / 60;
        RETURN CONCAT(@value, ' ', IIF(@value = 1, 'minute', 'minutes'), ' ago');
    END

    IF @diff < 86400 -- less than 1 day
    BEGIN
        SET @value = @diff / 3600;
        RETURN CONCAT(@value, ' ', IIF(@value = 1, 'hour', 'hours'), ' ago');
    END

    IF @diff < 2592000 -- less than 30 days (~1 month)
    BEGIN
        SET @value = @diff / 86400;
        RETURN CONCAT(@value, ' ', IIF(@value = 1, 'day', 'days'), ' ago');
    END

    IF @diff < 31536000 -- less than 365 days (~1 year)
    BEGIN
        SET @value = @diff / 2592000; -- 30-day months
        RETURN CONCAT(@value, ' ', IIF(@value = 1, 'month', 'months'), ' ago');
    END

    -- 1 year or more
    SET @value = @diff / 31536000;
    RETURN CONCAT(@value, ' ', IIF(@value = 1, 'year', 'years'), ' ago');
END;
GO