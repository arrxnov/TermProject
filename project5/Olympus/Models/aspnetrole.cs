using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class aspnetrole
{
    public string Id { get; set; } = null!;

    public string? Name { get; set; }

    public string? NormalizedName { get; set; }

    public string? ConcurrencyStamp { get; set; }

    public virtual ICollection<aspnetroleclaim> aspnetroleclaims { get; set; } = new List<aspnetroleclaim>();

    public virtual ICollection<aspnetuser> Users { get; set; } = new List<aspnetuser>();
}
