using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class Course
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Credits { get; set; } = null!;

    public string Description { get; set; } = null!;
}
