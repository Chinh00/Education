using Education.Core.Domain;
using Education.Core.Specification;
using NotificationService.Domain;

namespace NotificationService.AppCore.Usecases.Queries;

public class GetNotificationsByRoleSpec : ListSpecificationBase<Notification>
{
    public GetNotificationsByRoleSpec(IListQuery<ListResultModel<Notification>> query, string role)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.Title);
        ApplyInclude(c => c.Content);
        ApplyInclude(c => c.IsRead);
        ApplyInclude(c => c.Roles);
        ApplyInclude(c => c.CreatedAt);
        ApplyInclude(c => c.UpdatedAt);
        ApplyFilter(e => e.Roles.Contains(role));
    }
}