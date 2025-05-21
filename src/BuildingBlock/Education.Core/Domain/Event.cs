using MediatR;

namespace Education.Core.Domain;

public interface IIntegrationEvent : IMessage;
public interface IMessage : INotification;