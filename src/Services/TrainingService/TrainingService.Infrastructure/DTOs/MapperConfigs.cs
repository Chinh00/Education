using AutoMapper;
using TrainingService.Domain;

namespace TrainingService.Infrastructure.DTOs;

public class MapperConfigs : Profile
{
    public MapperConfigs()
    {
        CreateMap<EducationProgram, TrainingProgramDto>();
    }
}