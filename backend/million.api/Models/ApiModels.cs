namespace million.api.Models
{
    public class PropertyFilter
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Year { get; set; }
        public string? Owner { get; set; }
    }

    public class PropertySummary
    {
        public int TotalProperties { get; set; }
        public decimal TotalValue { get; set; }
        public decimal AveragePrice { get; set; }
    }

    public class ApiResponse<T>
    {
        public T Data { get; set; }
        public bool Success { get; set; } = true;
        public string? Message { get; set; }
        public int? Total { get; set; }

        // Parameterless constructor for JSON deserialization
        public ApiResponse()
        {
            Data = default(T)!;
        }

        public ApiResponse(T data)
        {
            Data = data;
        }

        public ApiResponse(T data, string message) : this(data)
        {
            Message = message;
        }

        public static ApiResponse<T> SuccessResponse(T data, string? message = null, int? total = null)
        {
            return new ApiResponse<T>(data)
            {
                Success = true,
                Message = message,
                Total = total
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, T? data = default)
        {
            return new ApiResponse<T>(data!)
            {
                Success = false,
                Message = message
            };
        }
    }
}
