using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class catalog
{
    public decimal year { get; set; }

    public virtual ICollection<gened> geneds { get; set; } = new List<gened>();

    public virtual ICollection<major> majors { get; set; } = new List<major>();

    public virtual ICollection<minor> minors { get; set; } = new List<minor>();

    public virtual ICollection<plan> plans { get; set; } = new List<plan>();

    public virtual ICollection<course> courses { get; set; } = new List<course>();
}
