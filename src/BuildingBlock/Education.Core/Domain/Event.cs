using MediatR;

namespace Education.Core.Domain;

public interface IIntegrationEvent : INotification;
public interface IMessage : INotification;