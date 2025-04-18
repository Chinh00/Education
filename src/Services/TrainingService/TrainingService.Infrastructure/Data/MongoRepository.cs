
using Education.Core.Domain;
using Education.Infrastructure.Mongodb;
using Microsoft.Extensions.Options;

namespace TrainingService.Infrastructure.Data;

public class MongoRepository<TEntity>(IOptions<MongoOptions> options, IServiceProvider serviceProvider) : MongoRepositoryBase<TEntity>(options)
    where TEntity : BaseEntity;