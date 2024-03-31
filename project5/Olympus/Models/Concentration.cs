using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class Concentration
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int MajorId { get; set; }
}
