using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class Plan
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int UserId { get; set; }

    public decimal CatalogYear { get; set; }
}
