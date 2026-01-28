using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Repository.Components
{
    public class CinemasViewComponent : ViewComponent
    {
        private readonly DataContext _dataContext;
        public CinemasViewComponent(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<IViewComponentResult> InvokeAsync() => View(_dataContext.Cinemas.ToList());

    }
}
