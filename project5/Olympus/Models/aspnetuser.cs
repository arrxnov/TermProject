using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class aspnetuser
{
    public string Id { get; set; } = null!;

    public string? UserName { get; set; }

    public string? NormalizedUserName { get; set; }

    public string? Email { get; set; }

    public string? NormalizedEmail { get; set; }

    public bool EmailConfirmed { get; set; }

    public string? PasswordHash { get; set; }

    public string? SecurityStamp { get; set; }

    public string? ConcurrencyStamp { get; set; }

    public string? PhoneNumber { get; set; }

    public bool PhoneNumberConfirmed { get; set; }

    public bool TwoFactorEnabled { get; set; }

    public DateTime? LockoutEnd { get; set; }

    public bool LockoutEnabled { get; set; }

    public int AccessFailedCount { get; set; }

    public virtual ICollection<aspnetuserclaim> aspnetuserclaims { get; set; } = new List<aspnetuserclaim>();

    public virtual ICollection<aspnetuserlogin> aspnetuserlogins { get; set; } = new List<aspnetuserlogin>();

    public virtual ICollection<aspnetusertoken> aspnetusertokens { get; set; } = new List<aspnetusertoken>();

    public virtual user? user { get; set; }

    public virtual ICollection<aspnetrole> Roles { get; set; } = new List<aspnetrole>();

    public virtual ICollection<aspnetuser> advisees { get; set; } = new List<aspnetuser>();

    public virtual ICollection<aspnetuser> advisors { get; set; } = new List<aspnetuser>();
}
