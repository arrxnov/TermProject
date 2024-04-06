using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class aspnetroleclaim
{
    public int Id { get; set; }

    public string RoleId { get; set; } = null!;

    public string? ClaimType { get; set; }

    public string? ClaimValue { get; set; }

    public virtual aspnetrole Role { get; set; } = null!;
}
