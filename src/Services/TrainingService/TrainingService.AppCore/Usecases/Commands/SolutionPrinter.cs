using Google.OrTools.Sat;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

class SolutionPrinter : CpSolverSolutionCallback
{
    private readonly Dictionary<(string classId, string roomId, int week, int day, int slotStart), BoolVar> _assignmentVars;
    private readonly List<CourseClass> _allClasses;
    private readonly IEnumerable<Room> _rooms;
    private readonly CpSolver _solver;
    private int _solutionCount = 0;

    public SolutionPrinter(
        Dictionary<(string, string, int, int, int), BoolVar> assignmentVars,
        List<CourseClass> allClasses,
        IEnumerable<Room> rooms,
        CpSolver solver)
    {
        _assignmentVars = assignmentVars;
        _allClasses = allClasses;
        _rooms = rooms;
        _solver = solver;
    }

    public override void OnSolutionCallback()
    {
        _solutionCount++;
        Console.WriteLine($"Giải pháp #{_solutionCount} được tìm thấy với giá trị mục tiêu = {_solver.ObjectiveValue}");

        foreach (var c in _allClasses)
        {
            for (int week = 0; week < c.DurationInWeeks; week++)
            {
                foreach (var r in _rooms)
                {
                    for (int day = 0; day < 6; day++)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            var key = (c.Id.ToString(), r.Id.ToString(), week, day, slot);
                            if (_assignmentVars.TryGetValue(key, out var variable) && BooleanValue(variable))
                            {
                                var slots = Enumerable.Range(slot, c.SessionLength).ToList();
                                Console.WriteLine($"➡️ [Realtime] Môn {c.SubjectCode} Lớp {c.ClassIndex} ({c.CourseClassType}) học ở phòng {r.Name} tuần {week + 1} ngày {day} slot {string.Join(",", slots)}");
                            }
                        }
                    }
                }
            }
        }
    }
}
