using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/student (Create Student)
    [HttpPost]
    public IActionResult CreateStudent(Students student)
    {
        if (student == null)
        {
            return BadRequest("Invalid student data");
        }

        _context.Students.Add(student);
        _context.SaveChanges();

        return Ok(student);
    }

    // GET: api/student (Get All Students)
    [HttpGet]
    public IActionResult GetStudents()
    {
        var students = _context.Students.ToList();
        return Ok(students);
    }

    // GET: api/student/{Telephone} (Get by Telephone)
    [HttpGet("{Telephone}")]
    public IActionResult GetStudentByTelephone(string Telephone)
    {
        var student = _context.Students
            .FirstOrDefault(s => s.Telephone == Telephone);

        if (student == null)
        {
            return NotFound("Student not found");
        }

        return Ok(student);
    }

    //  PUT: api/student/{Telephone} (Update Student)
    [HttpPut("{Telephone}")]
    public IActionResult UpdateStudent(string Telephone, Students updatedStudent)
    {
        var student = _context.Students
            .FirstOrDefault(s => s.Telephone == Telephone);

        if (student == null)
        {
            return NotFound("Student not found");
        }

        // Update fields
        student.FullName = updatedStudent.FullName;
        student.Address = updatedStudent.Address;
        student.DateOfBirth = updatedStudent.DateOfBirth;
        student.Gender = updatedStudent.Gender;
        student.Email = updatedStudent.Email;
        student.Telephone = updatedStudent.Telephone;

        _context.SaveChanges();

        return Ok(student);
    }

    //  DELETE: api/student/{Telephone}
    [HttpDelete("{Telephone}")]
    public IActionResult DeleteStudent(string Telephone)
    {
        var student = _context.Students
            .FirstOrDefault(s => s.Telephone == Telephone);

        if (student == null)
        {
            return NotFound("Student not found");
        }

        _context.Students.Remove(student);
        _context.SaveChanges();

        return Ok("Student deleted successfully");
    }
}