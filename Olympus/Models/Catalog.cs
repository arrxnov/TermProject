using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Olympus.Models;

public partial class Catalog
{
    [Key]
    public decimal Year { get; set; }
}
