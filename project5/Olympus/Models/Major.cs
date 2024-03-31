using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class Major
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal CatalogYear { get; set; }
}
