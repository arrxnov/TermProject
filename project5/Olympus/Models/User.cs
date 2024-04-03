﻿using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class User
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public decimal Gpa { get; set; }

    public decimal MajorGpa { get; set; }

    public int DefaultPlanId { get; set; }
}
