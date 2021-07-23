#ifndef PrettyPrint_h_
#define PrettyPrint_h_

#include "mozilla/Span.h"
#include "mozilla/Utf8.h"
#include <iostream>
#include <string_view>

static void OutputUTF8(mozilla::Span<const char> data) {
  std::cout << "\"";
  for (size_t i = 0; i < data.Length(); i++) {
    auto ch = data.data()[i];
    switch (ch) {
    case '\0':
      std::cout << "\\0";
      break;
    case '"':
      std::cout << "\\\"";
      break;
    default:
      std::cout << ch;
    }
  }
  std::cout << "\"";
}

void PrettyPrint(mozilla::Span<const char> string, const char *msg = "",
                 const char *typeName = "mozilla::Span<const char>") {
  std::cout << msg << typeName;
  if (!string.data()) {
    std::cout << " {\n  Length: " << string.Length()
              << " bytes,\n  String: nullptr,\n}";
  } else {
    std::cout << " {\n  Length: " << string.Length() << " bytes,\n  String: ";
    OutputUTF8(string);
    std::cout << ",\n  NullTerminated: ";
    if (string.data()[string.Length() - 1] == '\0') {
      std::cout << "inside of span";
    } else if (static_cast<const char *>(string.data())[string.Length()] ==
               '\0') {
      std::cout << "outside of span";
    } else {
      std::cout << "no";
    }
  }

  std::cout << ",\n}\n";
}

void PrettyPrint(std::basic_string_view<const char> string,
                 const char *msg = "") {
  PrettyPrint(mozilla::Span(string), msg, "std::string_view");
}

static std::string ToUtf8(mozilla::Span<const char16_t> input) {
  size_t buff_len = input.Length() * 3;
  std::string result(buff_len, ' ');
  result.reserve(buff_len);
  size_t result_len =
      ConvertUtf16toUtf8(input, mozilla::Span(result.data(), buff_len));
  result.resize(result_len);
  return result;
}

void PrettyPrint(mozilla::Span<const char16_t> string, const char *msg = "",
                 const char *typeName = "mozilla::Span<const char16_t>") {
  std::cout << msg << typeName << " {\n  Length: " << string.Length()
            << " characters,\n  String: ";

  OutputUTF8(ToUtf8(string));
  std::cout << ",\n  NullTerminated: ";
  if (string.data()[string.Length() - 1] == '\0') {
    std::cout << "inside of span";
  } else if (
      // Check for the value 0x0000
      reinterpret_cast<const char *>(string.data())[string.Length() * 2] ==
          '\0' &&
      reinterpret_cast<const char *>(string.data())[string.Length() * 2 + 1] ==
          '\0') {
    std::cout << "outside of span";
  } else {
    std::cout << "no";
  }

  std::cout << ",\n}\n";
}

void PrettyPrint(
    std::basic_string_view<const char16_t> string, const char *msg = "",
    const char *typeName = "std::basic_string_view<const char16_t>") {
  PrettyPrint(mozilla::Span(string), msg, typeName);
}

void PrettyPrint(const char16_t *aValue, const char *msg = "") {
  PrettyPrint(aValue, msg, "const char16_t *");
}

/**
 * Avoid implicit conversions by doing a template.
 */
template <typename T> void PrettyPrint(T aValue, const char *msg = "") {
  if constexpr (std::is_same_v<T, bool>) {
    std::cout << msg << "Boolean(" << (aValue ? "true" : "false") << ")\n";
  } else if (std::is_same_v<T, size_t>) {
    std::cout << msg << "size_t(" << aValue << ")\n";
  } else if (std::is_same_v<T, unsigned long>) {
    std::cout << msg << "unsigned long(" << aValue << ")\n";
  } else if (std::is_same_v<T, uint8_t>) {
    std::cout << msg << "uint8_t(" << static_cast<unsigned int>(aValue)
              << ")\n";
  } else {
    std::cout << msg << "PrettyPrintTODO(" << aValue << ")\n";
  }
}

void PrettyPrintBinary(int x) {
  auto *string = new char[9];
  string[0] = '\0';

  int z;
  for (z = 128; z > 0; z >>= 1) {
    strcat(string, ((x & z) == z) ? "1" : "0");
  }

  std::cout << string;
}

void PrettyPrintBinary(uint32_t x) {
  auto *string = new char[33];
  string[0] = '\0';

  uint32_t z;
  for (z = 1 << 31; z > 0; z >>= 1) {
    strcat(string, ((x & z) == z) ? "1" : "0");
  }

  std::cout << string;
}

template <typename A, typename B> void PrettyPrint(A a, B b) {
  PrettyPrint(a);
  PrettyPrint(b);
}
template <typename A, typename B, typename C> void PrettyPrint(A a, B b, C c) {
  PrettyPrint(a);
  PrettyPrint(b);
  PrettyPrint(c);
}
template <typename A, typename B, typename C, typename D>
void PrettyPrint(A a, B b, C c, D d) {
  PrettyPrint(a);
  PrettyPrint(b);
  PrettyPrint(c);
  PrettyPrint(d);
}
template <typename A, typename B, typename C, typename D, typename E>
void PrettyPrint(A a, B b, C c, D d, E e) {
  PrettyPrint(a);
  PrettyPrint(b);
  PrettyPrint(c);
  PrettyPrint(d);
  PrettyPrint(e);
}
template <typename A, typename B, typename C, typename D, typename E,
          typename F>
void PrettyPrint(A a, B b, C c, D d, E e, F f) {
  PrettyPrint(a);
  PrettyPrint(b);
  PrettyPrint(c);
  PrettyPrint(d);
  PrettyPrint(e);
  PrettyPrint(f);
}
template <typename A, typename B, typename C, typename D, typename E,
          typename F, typename G>
void PrettyPrint(A a, B b, C c, D d, E e, F f, G g) {
  PrettyPrint(a);
  PrettyPrint(b);
  PrettyPrint(c);
  PrettyPrint(d);
  PrettyPrint(e);
  PrettyPrint(f);
}

#endif
