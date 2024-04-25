import Year from './Year'

function Plan(plan) {
    // build years
    for (year of plan.years) {
        localYears.append(<Year year={year} plan={plan} />);
    }
    
    return (
        <>
            <Year year={plan.year} studentId={studentId} planId={plan} />
        </>
    )
}

export default Plan