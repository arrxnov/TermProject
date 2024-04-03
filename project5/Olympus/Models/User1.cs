using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class User1
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Phash { get; set; } = null!;

    public string Name { get; set; } = null!;

    public decimal Gpa { get; set; }

    public decimal MajorGpa { get; set; }

    public int DefaultPlanId { get; set; }
}
