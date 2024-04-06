using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class aspnetusertoken
{
    public string UserId { get; set; } = null!;

    public string LoginProvider { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Value { get; set; }

    public virtual aspnetuser User { get; set; } = null!;
}
