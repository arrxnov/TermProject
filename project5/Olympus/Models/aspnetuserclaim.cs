using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class aspnetuserclaim
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string? ClaimType { get; set; }

    public string? ClaimValue { get; set; }

    public virtual aspnetuser User { get; set; } = null!;
}
